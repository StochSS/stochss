from ec2_agent import EC2Agent
from common.config import AgentTypes

__author__ = 'hiranya'
__email__ = 'hiranya@appscale.com'


class InfrastructureAgentFactory:
    """
    Factory implementation which can be used to instantiate concrete infrastructure
    agents.
    """

    agents = {
        AgentTypes.EC2: EC2Agent
    }

    def create_agent(self, infrastructure):
        """
        Instantiate a new infrastructure agent.

        Args:
          infrastructure  A string indicating the type of infrastructure
                          agent to be initialized.

        Returns:
          An infrastructure agent instance that implements the BaseAgent API

        Raises:
          NameError       If the given input string does not map to any known
                          agent type.
        """
        if self.agents.has_key(infrastructure):
            return self.agents[infrastructure]()
        else:
            raise NameError('Unrecognized infrastructure: ' + infrastructure)