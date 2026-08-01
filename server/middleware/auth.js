import jwt from "jsonwebtoken";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set on the server. Add it to server/.env");
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, getSecret(), {
    expiresIn: "30d",
  });
}

// Requires a valid token — rejects the request if missing/invalid.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, getSecret());
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

// Attaches req.user if a valid token is present, but doesn't reject otherwise.
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, getSecret());
      req.user = { id: payload.sub, email: payload.email, name: payload.name };
    } catch {
      /* ignore invalid token, treat as anonymous */
    }
  }
  next();
}
