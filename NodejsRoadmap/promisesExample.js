const fs = require('fs');

// Simulated async task 1: Fetching user details
const fetchUserDetails = () => {
    return new Promise((resolve, reject) => {
        console.log("Fetching user details...");
        setTimeout(() => {
            resolve({ id: 1, name: 'John Doe' });
        }, 1000);
    });
};

// Simulated async task 2: Fetching user posts
const fetchUserPosts = (userId) => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching posts for user ID: ${userId}...`);
    setTimeout(() => {
        // Uncomment the next line to test error handling:
        // return reject("Failed to fetch posts!"); 
        resolve(["Post 1", "Post 2", "Post 3"]);
    }, 1000)
  });  
};

// Simulated async task 3: Writing user posts to a file
const writeUserPostsToFile = (posts) => {
    return new Promise((resolve, reject) => {
        console.log("Writing posts to file...");
        setTimeout(() => {
            fs.writeFile("userPosts.txt", posts.join("\n"), (err) => {
                if (err) return reject("Failed to save posts!");
                resolve("Posts saved to 'userPosts.txt'");
            });
        }, 1000);
    });
};

// Chaining Promises
fetchUserDetails()
    .then(user => {
        console.log("User Details:", user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log("User Posts:", posts);
        return writeUserPostsToFile(posts);
    })
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error("An error occurred:", error);
    });