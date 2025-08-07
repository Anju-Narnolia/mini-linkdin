const API_URL = "/api"; // Always relative for Next.js API routes

// REGISTER
export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// LOGIN
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// GET CURRENT USER
export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Could not fetch user");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// UPDATE CURRENT USER
export async function updateMe(
  token: string,
  userId: string,
  data: { name?: string; bio?: string }
) {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Update failed");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// GET SPECIFIC USER
export async function getUser(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`);

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "User not found");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// GET POSTS FEED
export async function getFeed(limit = 20, skip = 0) {
  const res = await fetch(`${API_URL}/posts?limit=${limit}&skip=${skip}`);

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get feed");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}

// GET SINGLE POST
export async function getPost(id: string) {
  const res = await fetch(`${API_URL}/posts/${id}`);

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Post not found");
    } else {
      throw new Error("Something went wrong (not JSON)");
    }
  }

  return res.json();
}


// CREATE A POST
export async function createPost(token: string, text: string) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create post");
    } else {
      throw new Error("Something went wrong (non-JSON response)");
    }
  }

  return res.json();
}
