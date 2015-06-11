class BaseStorageAgent(object):
    def upload_file(self, filename):
        raise NotImplementedError

    def delete_file(self, filename):
        raise NotImplementedError