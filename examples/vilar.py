from stochss import stochkit

def Vilar():
    """ 
        The 'Vilar Oscillator'.
        
        Demonstrates how to create a StochKitModel instance from a 
        native StochKit2 XML model document.
        
        Andreas Hellander, 2012.
        
    """
    try:
        doc = stochkit.StochMLDocument.fromFile("vilar.xml")
    except:
        raise NameError("Could not open vilar.xml")
    model = doc.toModel('vilar')
    return model

if __name__ == '__main__':
    
    """ Create a model and print it to native StochKit XML. """
    model = Vilar()
    print model.serialize()
   

