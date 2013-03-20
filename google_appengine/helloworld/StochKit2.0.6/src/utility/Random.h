/******************************************************************************
 *  FILE:    Random.h                                                         *
 ******************************************************************************/

#ifndef STOCHKIT_RANDOM_H
#define STOCHKIT_RANDOM_H

#include <iostream>
#include <vector>
#include <limits>
#include <ctime>
#include <cmath>

#include <boost/random/mersenne_twister.hpp>
#include <boost/random/uniform_int.hpp>
#include <boost/random/variate_generator.hpp>
#include <boost/random/uniform_01.hpp>
#include <boost/random/poisson_distribution.hpp>
#include <boost/random/exponential_distribution.hpp>
#include <boost/random/normal_distribution.hpp>
#include <boost/random/binomial_distribution.hpp>


namespace STOCHKIT{
	class RandomGenerator
	{
		private:

			boost::mt19937 generatorUniform;

		public:
			// constructor
			RandomGenerator(){}; 

			//! allow compiler-generated copy constructor
			//! allow compiler-generated assignment operator

			// without specified seed, use current time
			void Seed();

			// with specified seed RanSeed
			void Seed(boost::uint32_t RanSeed);

			// discrete uniform random number generator
			double DiscreteUniform();

			// continuous uniform random number in (a,b)
			double ContinuousOpen(double a, double b);

			// exponential random number
			double Exponential(double mean);

			// normal random number
			double Normal(double mean, double var);
		
			// poisson random number
			double Poisson(double mean);

			// binomial random number
			double Binomial(double n, double p);
		
	};//end class

}//end namespace

#endif
