pub contract Documinds {
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub var idCount: UInt64

    pub struct DocumentInfo {
        pub let id: UInt64
        pub let name: String
        pub let ipfsHash: String

        init(id: UInt64, name: String, ipfsHash: String) {
            self.id = id
            self.name = name
            self.ipfsHash = ipfsHash
        }
    }

    pub resource Document {
        pub var id: UInt64
        pub var name: String
        pub var ipfsHash: String

        init(id: UInt64, name: String, ipfsHash: String) {
            self.id = id
            self.name = name
            self.ipfsHash = ipfsHash
        }

        pub fun getDocInfo(): DocumentInfo {
            return DocumentInfo(
                id: self.id,
                name: self.name,
                ipfsHash: self.ipfsHash,
            )
        }
    }

    pub resource interface DocReceiver {
        pub var ownedDocs: @{UInt64: Document}

        pub fun deposit(token: @Document)

        pub fun getIDs(): [UInt64]

        pub fun idExists(id: UInt64): Bool
    }

    pub resource DocCollection: DocReceiver {
        pub var ownedDocs: @{UInt64: Document}

        init () {
            self.ownedDocs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @Document {
            let token <- self.ownedDocs.remove(key: withdrawID)!
            return <-token
        }

        pub fun deposit(token: @Document) {
            self.ownedDocs[token.id] <-! token
        }

        pub fun idExists(id: UInt64): Bool {
            return self.ownedDocs[id] != nil
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedDocs.keys
        }

        destroy() {
            destroy self.ownedDocs
        }
    }

    pub fun createEmptyDocCollection(): @DocCollection {
        return <- create DocCollection()
    }

    pub fun mintDocument(name: String, ipfsHash: String): @Document {

        var newDoc <- create Document(id: self.idCount, name: name, ipfsHash: ipfsHash)
        self.idCount = self.idCount + 1
        return <-newDoc
    }

    init() {
        self.CollectionStoragePath = /storage/DocumindsCollection
        self.CollectionPublicPath = /public/DocumindsCollection
        self.MinterStoragePath = /storage/DocumindsMinter

        self.idCount = 1
	}
}