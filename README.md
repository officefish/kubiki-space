## deploy 
 rsync -avz   --exclude 'node_modules'   --exclude 'mongo-data'   --exclude 'postgres-data'   -e "ssh -i ~/.ssh/id_rsa"   /mnt/c/Users/SA19S/nest/kubiki-space/   root@84.38.183.245:/root/n8n
## rebuild
docker-compose down --volumes --remove-orphans
docker-compose up --build