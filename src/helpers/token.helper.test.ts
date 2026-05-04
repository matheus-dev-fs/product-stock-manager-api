import { generateAccessToken, generateRefreshToken, parseBearerToken, verifyAccessToken } from './token.helper';

describe('token.helper', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '15m';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('generates and verifies access tokens', () => {
    const payload = { id: 'user-id', email: 'user@test.com', isAdmin: false };
    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded).toEqual(payload);
  });

  it('generates refresh tokens with 64 chars', () => {
    const token = generateRefreshToken();
    expect(token).toHaveLength(64);
  });

  it('parses bearer tokens', () => {
    expect(parseBearerToken('Bearer abc123')).toBe('abc123');
    expect(parseBearerToken('Basic abc123')).toBeNull();
    expect(parseBearerToken('Bearer')).toBeNull();
  });
});
