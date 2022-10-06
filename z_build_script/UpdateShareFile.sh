#! /bin/bash
set -e
set -o pipefail

SCRIPT_NAME="z_build_script/UpdateShareFile.sh"
ORG_SHARE_DIR="./share" 
FRONTEND_SHARE_DIR="./frontend/share"
BACKEND_SHARE_DIR="./backend/share"

CheckMigrateResult () {
    source_files_c=$(find $1 -type f | wc -l)
    dest_files_c=$(find $2 -type f | wc -l)
    if [ $source_files_c -eq $dest_files_c ]
    then
         echo "> Total migrated files: $source_files_c"
        return 0
    else
        echo -e "Error)>> from Compairing Source - Dest Dir
        Missmatch numbers of subfiles between Source and destination DIR
        Source: $1 
        Source subfiles count: $source_files_c 
        Destination: $2 
        Destination subfiles count: $dest_files_c "
        echo "error on: ${SCRIPT_NAME} -> func CheckDirFiles"
        exit 64
    fi
}

FlashShareDir () {
    echo "> Setting Project Structure"
    echo "> Flashing Frontend share DIR - Frontend share: $1 ..."
    rm -r $1
    echo "> Flashing Backend share DIR - Backend share: $2 ..."
    rm -r $2
    echo "> Done"
}

CopyShareFiles () {
    echo "> Copy all share files to Front & Back dir - Original share Dir:$1 ..."
    cp -r $1 $2
    cp -r $1 $3
    CheckMigrateResult $1 $2
    CheckMigrateResult $1 $3
    echo "> Done"
}

echo -e "\n\nSoManyCustom: Synchronizing Front & Back SHARED files has been started -..."
echo -e "\n"
FlashShareDir $FRONTEND_SHARE_DIR $BACKEND_SHARE_DIR
echo -e "\n"
CopyShareFiles $ORG_SHARE_DIR $FRONTEND_SHARE_DIR $BACKEND_SHARE_DIR
echo -e "\nSoManyCustom: Synchronizing Front & Back SHARED files has been successed.\n"