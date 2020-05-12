import setuptools

setuptools.setup(
    name="stochss-singleuser",
    version="2.0.1",
    author="StochSS Team",
    author_email="bdrawert@unca.edu",
    description="StochSS is an integrated development environment (IDE) for simulation of biochemical networks.",
    long_description="StochSS is an integrated development environment (IDE) for simulation of biochemical networks.",
    long_description_content_type="text/markdown",
    url="https://github.com/StochSS/stochss",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
