#include <iostream>
#include <fstream>
#include <sbml/SBMLTypes.h>
#include <string>
#include "output.h"
using namespace std;

int main (int argc, char* argv[])
{
	unsigned int i;
	const char *filename="filename.xml";
	const char *rename="filename.stochkit.xml";
	string strname, outname, choice;
	//if a new name is given by argv[2], the new one will be used
	if (argc == 1)
	{
		cout << endl << "Please input the SBML file name:" << endl;
		cin  >> strname;
		filename=strname.c_str();
		cout << "Do you want to input the output file name (y or n): ";
		cin  >> choice;
		while(1)
		{
			if(choice=="y"||choice=="yes")
			{
				cout<< "Type in the file name:"<<endl;
				cin >> outname;
				rename=outname.c_str();
				break;
			}
			else if(choice=="n"||choice=="no")
			{
				cout<< "Default output name is used"<<endl;
				if(strname.size()>=4&&strname.substr(strname.size()-4,4)==".xml")
					outname=strname.substr(0,strname.size()-4);
				else
					outname=strname;
				outname+=".stochkit.xml";
				rename=outname.c_str();
				break;
			}
			else
			{
				cout<< "Unknown choice, do you want to input the output file name, type 'y' or 'yes' for yes, 'n' or 'no' for no: ";
				choice.clear();
				cin >>choice;
			}
		}
	}
	else if (argc == 2)
	{
		filename=argv[1];
		strname.assign(argv[1]);
		if(strname.size()>=4&&strname.substr(strname.size()-4,4)==".xml")
			outname=strname.substr(0,strname.size()-4);
		else
			outname=strname;
		outname+=".stochkit.xml";
		rename=outname.c_str();
	}
	else if (argc == 3)
	{
		filename=argv[1];
		rename=argv[2];
	}
	else
	{
		cerr << endl << "The converter does not accept more than 2 arguments" << endl;
		exit(0);
	}
	SBMLDocument* document;
	SBMLReader reader;
	Model *model;
	document = reader.readSBML(filename);
	model=document->getModel();
	if(model==NULL)
	{
		cerr<<endl<<"Converter stops. The sbml file is invalid"<<endl;
		exit(0);
	}

	//creat the log file
	string logname(rename);
	logname+=".log";
	ofstream out(logname.c_str());

	unsigned int errors = document->getNumErrors();

	cout << endl;
	cout << "Input filename: " << filename<< endl;
	cout << "validation error(s): " << errors << endl;

	// copy the data to the log file.
	out << "            filename: " << filename              << endl;
	out << " validation error(s): " << errors << endl;
	out << endl;

	bool seriousErrors = false;

	if (errors > 0)
	{
		cout << "Please refer to the log file '" << logname << "' for detailed information of validation errors." << endl << endl;
		for (i = 0; i < errors; i++)
		{
			unsigned int severity = document->getError(i)->getSeverity();
			if (severity == LIBSBML_SEV_ERROR || severity == LIBSBML_SEV_FATAL)
			{
				seriousErrors = true;
				break;
			}
		}

		out << endl << "Encountered " << errors << " "
			<< (seriousErrors ? "error" : "warning") << (errors == 1 ? "" : "s")
			<< " in this file:" << endl;
		document->printErrors(out);
	}

	// If serious errors are encountered while reading an SBML document, it
	// does not make sense to go on and do full consistency checking because
	// the model may be nonsense in the first place.

	if (seriousErrors)
	{
		cout << endl << "StochKit ERROR: Further consistency checking aborted." << endl;
		out << endl << "StochKit ERROR: Further consistency checking aborted." << endl;
		exit(0);
	}
	else
	{
		unsigned int failures = document->checkConsistency();

		if (failures > 0)
		{
			out << endl << "Encountered " << failures << " consistency failure"
				<< (failures == 1 ? "" : "s") << " in this file:" << endl;
			document->printErrors(out);
		}
		else
		{
			out << "               errors: 0" << endl;
		}
	}


//	output(model, rename);
	myModel mymodel(model, rename);
	mymodel.output();
	if (argc == 2)
	{
		cout << "Output filename (default): " << rename << endl;

	}
	else if (argc == 3)
	{
		cout << "Output filename: " << rename << endl;

	}
	out.close();

	delete document;
	return errors;
}
