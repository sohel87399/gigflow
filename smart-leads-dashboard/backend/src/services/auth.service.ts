import { User, IUserDocument } from '../models/User.model';
import { signToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/error.middleware';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { UserRole } from '../types';

export interface AuthResult {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
  };
  token: string;
}

/**
 * Registers a new user.
 * Checks for duplicate email, creates the user, and returns a JWT + user object.
 */
export const registerUser = async (
  input: RegisterInput
): Promise<AuthResult> => {
  const { name, email, password, role } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user: IUserDocument = await User.create({
    name,
    email,
    password,
    role: role ?? 'sales_user',
  });

  const token = signToken(user._id.toString(), user.role);

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Authenticates a user with email and password.
 * Returns a JWT + user object on success, throws 401 on failure.
 */
export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id.toString(), user.role);

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};
