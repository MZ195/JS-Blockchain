import hashlib


class Block(object):

    def __init__(self, data):
        self.id = 0
        self.nonce = 144444
        self.body = data
        self.hash = ""
        
    
    def generate_hash(self):
        self.hash = hashlib.sha256(self.body.encode()).hexdigest()
        return self

    def jsonify(self):
        result = {
            'Id': self.id,
            'Nonce': self.nonce,
            'Body': self.body,
            'Hash': self.hash
        }
        return result



    
if __name__ == "__main__":
    block = Block("Test Block")
    block.generate_hash()
    print("Hash: {}".format(block.hash))
    print("Block: {}".format(block.jsonify()))

