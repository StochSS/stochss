echo Running
docker run --rm -d \
	--name stochss-lab \
	--env-file .env \
	-v $(pwd):/stochss \
	-p 8888:8888 \
	stochss-lab:latest \
	&	

#allow time to launch container
echo Sleeping
sleep 20
#extract jupyter notebook URL from container
echo Extracting
STOCHSS_URL=$(docker exec stochss-lab jupyter notebook list | grep -Eo '(http|https)://[^ ]+')
echo Opening
python selenium_test_run.py $STOCHSS_URL
echo Stopping Docker container.
docker container stop stochss-lab
