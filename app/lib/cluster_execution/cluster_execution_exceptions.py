class ModuleFileNotReadable(Exception):
    pass


class RemoteJobNotFinished(Exception):
    pass


class RemoteJobFailed(Exception):
    pass


class UnknownScratchDir(Exception):
    pass


class ReferencedModuleException(Exception):
    pass


class IncorrectRemoteHostSpec(Exception):
    pass


class ClusterExecutionException(Exception):
    pass
