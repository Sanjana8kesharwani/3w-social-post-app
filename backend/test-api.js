const PORT = process.env.PORT || 5050;
const BASE_URL = `http://localhost:${PORT}/api`;

// Generate a random user each test run to prevent uniqueness constraint failures
const testUser = {
  username: `tester_${Math.floor(Math.random() * 10000)}`,
  email: `test_${Math.floor(Math.random() * 10000)}@test.com`,
  password: 'testPassword123'
};

let token = '';
let createdPostId = '';

async function testSignup() {
  console.log('Testing POST /api/auth/signup...');
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data = await res.json();
    if (res.status === 201 && data.token) {
      token = data.token;
      console.log('✅ Signup passed successfully!');
      return true;
    } else {
      console.error('❌ Signup failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Signup Error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('Testing POST /api/auth/login...');
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      }),
    });

    const data = await res.json();
    if (res.status === 200 && data.token) {
      console.log('✅ Login passed successfully!');
      return true;
    } else {
      console.error('❌ Login failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    return false;
  }
}

async function testCreatePost() {
  console.log('Testing POST /api/posts (Text post creation)...');
  try {
    const formData = new FormData();
    formData.append('text', 'Automated script test content.');

    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (res.status === 201 && data._id) {
      createdPostId = data._id;
      console.log('✅ Post creation passed successfully! ID:', createdPostId);
      return true;
    } else {
      console.error('❌ Post creation failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Post creation Error:', error.message);
    return false;
  }
}

async function testGetPosts() {
  console.log('Testing GET /api/posts (Paginated retrieve)...');
  try {
    const res = await fetch(`${BASE_URL}/posts?page=1&limit=5`);
    const data = await res.json();
    if (res.status === 200 && data.posts && Array.isArray(data.posts)) {
      console.log(`✅ Get posts passed! Total posts in DB: ${data.totalPosts}, Page: ${data.currentPage}/${data.totalPages}`);
      return true;
    } else {
      console.error('❌ Get posts failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Get posts Error:', error.message);
    return false;
  }
}

async function testToggleLike() {
  console.log('Testing PUT /api/posts/:id/like (Like toggle)...');
  try {
    const res = await fetch(`${BASE_URL}/posts/${createdPostId}/like`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.status === 200 && data.likes) {
      const hasLiked = data.likes.some(like => like.username === testUser.username);
      console.log(`✅ Like toggled! Is Liked by test user: ${hasLiked}, Current Likes: ${data.likes.length}`);
      return true;
    } else {
      console.error('❌ Like toggle failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Like toggle Error:', error.message);
    return false;
  }
}

async function testAddComment() {
  console.log('Testing POST /api/posts/:id/comment (Add comment)...');
  try {
    const commentBody = { comment: 'Automated test comment.' };
    const res = await fetch(`${BASE_URL}/posts/${createdPostId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentBody)
    });

    const data = await res.json();
    if (res.status === 201 && data.comments) {
      console.log(`✅ Comment added! Total comments: ${data.comments.length}`);
      return true;
    } else {
      console.error('❌ Comment failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Comment Error:', error.message);
    return false;
  }
}

async function run() {
  console.log('Running automated backend API validation test script...');
  console.log(`Targeting base url: ${BASE_URL}\n`);

  const signupRes = await testSignup();
  if (!signupRes) process.exit(1);

  const loginRes = await testLogin();
  if (!loginRes) process.exit(1);

  const createPostRes = await testCreatePost();
  if (!createPostRes) process.exit(1);

  const getPostsRes = await testGetPosts();
  if (!getPostsRes) process.exit(1);

  const likeRes = await testToggleLike();
  if (!likeRes) process.exit(1);

  const commentRes = await testAddComment();
  if (!commentRes) process.exit(1);

  console.log('\n🎉 SUCCESS: All backend API routes tested and verified!');
  process.exit(0);
}

run();
