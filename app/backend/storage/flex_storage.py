from base_storage import BaseStorageAgent

import sys
import logging
import os

from common.config import FlexConfig


class FlexStorageAgent(BaseStorageAgent):

    def __init__(self, queue_head_ip, queue_head_username, queue_head_keyfile):
        self.queue_head_ip = queue_head_ip
        self.queue_head_username = queue_head_username
        self.queue_head_keyfile = queue_head_keyfile

    def __get_scp_command(self, target, source):
        return 'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {keyfile} {source} {target}'.format(
            keyfile=self.queue_head_keyfile, user=self.queue_head_username, ip=self.queue_head_ip,
            source=source, target=target)

    def upload_file(self, filename):
        try:
            scp_command = \
                self.__get_scp_command(target="{user}@{ip}:{file}".format(file=os.path.join(FlexConfig.OUTPUT_STORE_DIR,
                                                                                            os.path.basename(filename))
                                                ),
                                    source=filename)

            logging.info(scp_command)

            if os.system(scp_command) != 0:
                raise Exception('FlexStorageAgent: scp failed!')

            return "scp://{username}@{ip}:{keyname}:{output_tar}".format(username=self.queue_head_username,
                                                                         ip=self.queue_head_ip,
                                                                         keyname=os.path.basename(self.queue_head_keyfile),
                                                                         output_tar=filename)

        except Exception, e:
            logging.error("FlexStorageAgent failed with exception:\n{0}".format(str(e)))
            raise e