const conf = {
  appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

  appwriteScheduleCollectionID: String(
    import.meta.env.VITE_APPWRITE_SCHEDULE_COLLECTION_ID
  ),

  appwriteAttendClassesCollectionID: String(
    import.meta.env.VITE_APPWRITE_ATTEND_CLASSES_COLLECTION_ID
  ),
  appwriteUserProfileInformation: String(
    import.meta.env.VITE_APPWRITE_USER_PROFILE_INFORMATION
  ),

  appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;
