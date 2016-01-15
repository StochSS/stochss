host_name="$(hostname -I)"
sed -i "s/localhost/${host_name}/g" launchapp.py 
sed -i "s/localhost/${host_name}/g" generate_admin_token.py 
sed -i "55s/^/#/" app/handlers/auth.py
sed -i "56s/^/#/" app/handlers/auth.py
