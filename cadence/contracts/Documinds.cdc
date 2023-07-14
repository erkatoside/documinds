pub contract Documinds {
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub var idCount: UInt64

    pub struct DocumentInfo {
        pub let id: UInt64
        pub let slug: String
        pub let ipfsUrl: String

        init(id: UInt64, slug: String, ipfsUrl: String) {
            self.id = id
            self.slug = slug
            self.ipfsUrl = ipfsUrl
        }
    }

    pub resource Document {
        pub var id: UInt64
        pub var slug: String
        pub var ipfsUrl: String

        init(id: UInt64, slug: String, ipfsUrl: String) {
            self.id = id
            self.slug = slug
            self.ipfsUrl = ipfsUrl
        }

        pub fun getDocInfo(): DocumentInfo {
            return DocumentInfo(
                id: self.id,
                slug: self.slug,
                ipfsUrl: self.ipfsUrl,
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

    pub fun mintDocument(slug: String, ipfsUrl: String): @Document {

        var newDoc <- create Document(id: self.idCount, slug: slug, ipfsUrl: ipfsUrl)
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