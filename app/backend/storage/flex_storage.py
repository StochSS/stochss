from base_storage import BaseStorageAgent

import sys
import logging
import os

from common.config import FlexConfig

def get_scp_command(user, ip, keyfile, target, source):
    return 'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {keyfile} {source} {user}@{ip}:{target}'.format(
        keyfile=keyfile, user=user, ip=ip,
        source=source, target=target)

class FlexStorageAgent(BaseStorageAgent):

    def __init__(self, queue_head_ip, queue_head_username, queue_head_keyfile):
        self.queue_head_ip = queue_head_ip
        self.queue_head_username = queue_head_username
        self.queue_head_keyfile = queue_head_keyfile

    def upload_file(self, filename):
        try:
            scp_command = get_scp_command(user=self.queue_head_username, ip=self.queue_head_ip,
                                      keyfile=self.queue_head_keyfile,
                                      target=os.path.join(FlexConfig.OUTPUT_STORE_DIR, os.path.basename(filename)),
                                      source=filename)

            logging.info(scp_command)

            if os.system(scp_command) != 0:
                raise Exception('FlexStorageAgent: scp failed!')

        except Exception, e:
            logging.error("FlexStorageAgent failed with exception:\n{0}".format(str(e)))
            raise e