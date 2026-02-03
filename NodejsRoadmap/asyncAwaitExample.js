const fs = require('fs').promises;    // Use promise-based fs API

const fetchUserDetails = () => {
    return new Promise((resolve) => {
        console.log("Fetching user details...");
        setTimeout(() => {
            resolve({ id: 1, name: 'John Doe' });
        }, 1000);
    });
};

const fetchUserPosts = (userId) => {
    return new Promise((resolve, reject) => {
        console.log(`Fetching posts for user ID: ${userId}...`);
        setTimeout(() => {
            resolve(["Post 1", "Post 2", "Post 3"]);
        }, 1000);
    });
};

const writeUserPostsToFile = async (posts) => {
    console.log("Writing posts to file...");
    await fs.writeFile("userPosts.txt", posts.join("\n"));
    return "Posts saved to 'userPosts.txt'";
};

(async () => {
    try {
        const user = await fetchUserDetails();
        console.log("User Details:", user);

        const posts = await fetchUserPosts(user.id);
        console.log("User Posts:", posts);

        const result = await writeUserPostsToFile(posts);
        console.log(result);
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();