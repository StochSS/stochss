#ifndef OUTPUTWRITER__H
#define OUTPUTWRITER__H

/*
 A. Hellander, 2014-04-28
 B. Drawert    2014-04-28
 */



/* Struct to hold variables used for incremental IO of trajectory data during the simulation. */
typedef struct{
    
    hid_t output_file;
    
    hid_t trajectory_dataset;
    hid_t datatype;
    hid_t trajectory_dataspace;
    
    size_t num_columns;
    size_t buffer_size;
    size_t num_columns_since_flush;
    size_t chunk_indx;
    size_t total_columns_written;
    
    herr_t status;
    /* dataset dimensions */
    hsize_t dataset_dims[2];
    hsize_t chunk_dims[2];
    
    hid_t plist;
    
    int *buffer;
    
    int Ndofs;
    int Ncells;
    int Mspecies;
    
    
} urdme_output_writer;

urdme_output_writer *get_urdme_output_writer(urdme_model *model, char* filename);
hid_t get_output_file(char *filename);
void write_tspan(urdme_output_writer *writer, urdme_model *model);
int flush_buffer(urdme_output_writer *writer);
int write_state(urdme_output_writer *writer, int *xx);
int flush_solution_to_file(hid_t trajectory_dataset,int *buffer,int column_offset, int num_columns, int col_size);
void destroy_output_writer(urdme_output_writer *writer);

#endif