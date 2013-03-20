/******************************************************************************
 *  FILE:    Random.cpp                                                       *
 ******************************************************************************/

#include "Random.h"

namespace STOCHKIT
{
	// without specified seed, use current time
	void RandomGenerator::Seed()
	{
		generatorUniform.seed((boost::uint32_t) time(NULL));
	}

	// with specified seed RanSeed
	void RandomGenerator::Seed(boost::uint32_t RanSeed)
	{
		generatorUniform.seed(RanSeed);
	}

	// discrete uniform random number generator
	double RandomGenerator::DiscreteUniform()
	{
		return generatorUniform();
	}

	// continuous uniform random number in (a,b)
	double RandomGenerator::ContinuousOpen(double a, double b)
	{
		boost::uniform_01<> ContinuousZeroOneOpen;
		boost::variate_generator<boost::mt19937&, boost::uniform_01<> > generatorContinuousZeroOneOpen(generatorUniform, ContinuousZeroOneOpen);
		return (generatorContinuousZeroOneOpen()*(b-a) + a);
	}

	// exponential random number
	double RandomGenerator::Exponential(double mean)
	{
		double lambda;
		if(mean==0)
		{
			lambda=std::numeric_limits<double>::max();
			std::cout<<"0 mean is given to the exponential random number generator"<<"\n";
		}
		else if(mean>=std::numeric_limits<double>::max())
		{
			return mean;
		}
		else
			lambda=1/mean;
		boost::exponential_distribution<> ExponentialDistribution(lambda);
		boost::variate_generator<boost::mt19937&, boost::exponential_distribution<> > generatorExponential(generatorUniform, ExponentialDistribution);
		return generatorExponential();
	}

	// normal random number
	double RandomGenerator::Normal(double mean, double var)
	{
		boost::normal_distribution<> NormalDistribution(mean, sqrt(var));
		boost::variate_generator<boost::mt19937&, boost::normal_distribution<> > generatorNormal(generatorUniform, NormalDistribution);
		return generatorNormal();
	}

	// poisson random number
	double RandomGenerator::Poisson(double mean)
	{
		double result, rounded_result;
		if(mean==0)
			return 0;
		else if(mean<=700)
		{
			boost::poisson_distribution<> PoissonDistribution(mean);
			boost::variate_generator<boost::mt19937&, boost::poisson_distribution<> > generatorPoisson(generatorUniform, PoissonDistribution);
			return generatorPoisson();
		}
		else
		{
			result=Normal(mean, mean);
			rounded_result=floor(result);
			return (result-rounded_result)<0.5?rounded_result:(rounded_result+1);
		}
	}

	// binomial random number
	double RandomGenerator::Binomial(double n, double p)
	{
		double result, rounded_result;

		p=std::min(1.0, p);

		if(n<=20)
		{
			boost::binomial_distribution<> BinomialDistribution((int)n, p);
			boost::variate_generator<boost::mt19937&, boost::binomial_distribution<> > generatorBinomial(generatorUniform, BinomialDistribution);
			return generatorBinomial();
		}
		else
		{
			result=std::min(n, Normal(n*p, n*p*(1-p)));
			rounded_result=floor(result);
			return (result-rounded_result)<0.5?rounded_result:(rounded_result+1);
		}
	}

}//end namespace
