APP_DIR="/Users/ahmetkucuk/Documents/Developer/go/solardb/src/solardatabase/"
DEP_DIR="/Users/ahmetkucuk/Documents/Deployment/SolarDB/"
VERSION_FILE="conf/version.txt"
CONFIG_FILE="conf/app.conf"
SERVER_CONFIG_FILE="conf/app-server.conf"
rm -rf $DEP_DIR
mkdir $DEP_DIR
cd $APP_DIR
env GOOS=linux GOARCH=amd64 bee pack
cp $APP_DIR"solardatabase.tar.gz" $DEP_DIR
cd $DEP_DIR
mkdir solardatabase
tar -zvxf "solardatabase.tar.gz" -C "./solardatabase"
cd solardatabase
touch $VERSION_FILE
date +%s >> $VERSION_FILE
rm $CONFIG_FILE
mv $SERVER_CONFIG_FILE $CONFIG_FILE
cd $DEP_DIR
scp -r solardatabase ahmet@dmlab.cs.gsu.edu:/home/ahmet