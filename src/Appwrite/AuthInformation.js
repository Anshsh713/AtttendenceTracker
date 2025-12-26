import { Client, Databases, Query, ID } from "appwrite";
import conf from "../Data_management/conf/conf";

export class AuthInformation {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteURL)
      .setProject(conf.appwriteProjectID);

    this.databases = new Databases(this.client);
    this.databaseId = conf.appwriteDatabaseID;
    this.profileCollectionId = conf.appwriteUserProfileInformation;
  }

  async createUserandUpdateProfile(userId, data) {
    try {
      const existingProfile = await this.databases.listDocuments(
        this.databaseId,
        this.profileCollectionId,
        [Query.equal("UserID", userId)]
      );

      if (existingProfile.documents.length > 0) {
        const documentId = existingProfile.documents[0].$id;

        return await this.databases.updateDocument(
          this.databaseId,
          this.profileCollectionId,
          documentId,
          data
        );
      }

      return await this.databases.createDocument(
        this.databaseId,
        this.profileCollectionId,
        ID.unique(),
        {
          UserID: userId,
          ...data,
        }
      );
    } catch (error) {
      console.error("Profile Error:", error);
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const res = await this.databases.listDocuments(
        this.databaseId,
        this.profileCollectionId,
        [Query.equal("UserID", userId)]
      );

      return res.documents[0] ?? null;
    } catch (error) {
      console.error("No profile found");
      return null;
    }
  }
}

const authInformation = new AuthInformation();
export default authInformation;
