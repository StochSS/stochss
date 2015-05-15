/* A. Hellander and B. Drawert. */
#include <string.h>
#include "urdmemodel.h"
#include "outputwriter.h"
#include "hdf5.h"
#include "hdf5_hl.h"

/* This is the maximal buffer size we use to store the solution before writing to file. */
const size_t MAX_BUFFER_SIZE = 8388608; // 8 MB


/* Get an initialized urdme_output_writer */
urdme_output_writer *get_urdme_output_writer(urdme_model *model, char *filename)
{
    urdme_output_writer *writer;
    writer = (urdme_output_writer *)malloc(sizeof(urdme_output_writer));
    
    
    /* Open a file handle to the output file. */
    writer->output_file = get_hdf5_file(filename);
    
    writer->datatype = H5Tcopy(H5T_NATIVE_INT);
    
    printf("Ncells:%i Mspecies: %i",model->Ncells, model->Mspecies);
    int Ndofs = model->Ncells*model->Mspecies;
    
    /* How many timepoints do we log before the buffer is full? */
    size_t column_size = Ndofs*sizeof(int);
    writer->num_columns = MAX_BUFFER_SIZE / column_size;
    if (writer->num_columns > model->tlen){
        writer->num_columns = model->tlen;
    }
    
    /* Initialize a buffer */
    writer->buffer_size = writer->num_columns*Ndofs;
    writer->buffer = (int *)calloc(writer->buffer_size,sizeof(int));
    writer->num_columns_since_flush = 0;
    writer->chunk_indx=0;
    writer->total_columns_written = 0;
    
    writer->dataset_dims[0] = model->tlen;
    writer->dataset_dims[1] = Ndofs;
    
    writer->chunk_dims[0] = writer->num_columns;
    writer->chunk_dims[1] = Ndofs;
    
    
    writer->trajectory_dataspace = H5Screate_simple(2, writer->dataset_dims, NULL);
    writer->plist = H5Pcreate(H5P_DATASET_CREATE);
    H5Pset_chunk(writer->plist,2,writer->chunk_dims);
    
    /* Uncommenting this line would enable zlib compression of the file. */
    herr_t status = H5Pset_deflate (writer->plist, 3);
    //herr_t status = H5Pset_szip(writer->plist,  H5_SZIP_EC_OPTION_MASK, 128);
    
    writer->trajectory_dataset = H5Dcreate2(writer->output_file, "/U", writer->datatype, writer->trajectory_dataspace, H5P_DEFAULT,writer->plist,H5P_DEFAULT);
    
    writer->Ncells = model->Ncells;
    writer->Mspecies = model->Mspecies;
    writer->Ndofs = Ndofs;
    
    return writer;
    
}

/* Deallocate the writer. */
void destroy_output_writer(urdme_output_writer *writer)
{
    
    /* Close the file */
    H5Fclose(writer->output_file);
    
    /* Close the datasets */
    H5Sclose(writer->trajectory_dataspace);
    H5Dclose(writer->trajectory_dataset);
    free(writer->buffer);
    free(writer);
    
}

/* Return a handle to a HDF5 file. */
hid_t get_hdf5_file(char *filename)
{
    
    herr_t status;
    hid_t h5_file;
    h5_file = H5Fcreate(filename,H5F_ACC_TRUNC, H5P_DEFAULT,H5P_DEFAULT);
    if (h5_file == NULL){
        printf("Fatal error. Failed to open HDF5 file.");
        exit(-1);
    }
    return h5_file;
    
}

/* Write tspan to the file */
void write_tspan(urdme_output_writer *writer, urdme_model *model)
{
    
    herr_t status;
    hsize_t dataset_dims[2]; /* dataset dimensions */
    
    dataset_dims[0] = 1;
    dataset_dims[1] = model->tlen;
    status = H5LTmake_dataset(writer->output_file,"/tspan",2,dataset_dims,H5T_NATIVE_DOUBLE,model->tspan);
    if (status != 0){
        printf("Failed to write tspan vector HDF5 file.");
        exit(-1);
    }
    
}

int write_state(urdme_output_writer *writer, int *xx)
{
    
    int i,s;
    herr_t status;
    /* Write to the buffer */
    for (i=0; i<writer->Ncells;i++){
        for (s=0; s<writer->Mspecies; s++){
            writer->buffer[writer->Ndofs*writer->num_columns_since_flush+s*writer->Ncells+i] = xx[i*writer->Mspecies+s];
        }
    }
    
    writer->num_columns_since_flush++;
    
    if (writer->num_columns_since_flush == writer->num_columns){
        
        status = flush_buffer(writer);
        if (status){
            return -1;
        }
        
        writer->num_columns_since_flush = 0;
        writer->chunk_indx++;
        writer->total_columns_written += writer->num_columns;
    }
    
    return 0;
    
}

int flush_buffer(urdme_output_writer *writer)
{
    
    herr_t status;
    
    if (writer->num_columns_since_flush > 0){
        status = flush_solution_to_file(writer->trajectory_dataset,writer->buffer,writer->chunk_indx*writer->num_columns,writer->num_columns_since_flush,writer->Ndofs);
        if (status){
            return -1;
        }
    }
    writer->total_columns_written += writer->num_columns_since_flush;
    return 0;
}

/* Flush buffer to the hdf5 file. */
int flush_solution_to_file(hid_t trajectory_dataset,int *buffer,int column_offset, int num_columns, int col_size)
{
    
    /* This  is the column offset in the hdf5 datafile. */
    hsize_t start[2];
    hsize_t count[2];
    hsize_t block[2];
    
    /* Some parameters for the hyperslabs we need to select. */
    start[0] = column_offset;
    start[1] = 0;
    
    count[0] = 1;
    count[1] = 1;
    
    block[0] = num_columns;
    block[1] = col_size;
    
    herr_t status;
    
    /* A memory space to indicate the size of the buffer. */
    hsize_t mem_dims[2];
    mem_dims[0] = num_columns;
    mem_dims[1] = col_size;
    hid_t mem_space = H5Screate_simple(2, mem_dims, NULL);
    
    hid_t file_dataspace = H5Dget_space(trajectory_dataset);
    
    status =H5Sselect_hyperslab(file_dataspace, H5S_SELECT_SET, start, NULL,count,block);
    if (status){
        printf("Failed to select hyperslab.");
        return -1;
    }
    
    status = H5Dwrite(trajectory_dataset, H5T_NATIVE_INT, mem_space,file_dataspace,H5P_DEFAULT,buffer);
    if (status){
        printf("Failed to write to the dataset.");
        return -1;
    }
    
    H5Sclose(mem_space);
    H5Sclose(file_dataspace);
    return 0;
}


