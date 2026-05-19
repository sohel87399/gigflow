import { User } from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { UpdateProfileInput, ChangePasswordInput } from '../schemas/settings.schema';
import { UserRole } from '../types';

export interface ProfileResult {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Updates the authenticated user's name and/or email.
 */
export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
): Promise<ProfileResult> => {
  const { name, email } = input;

  // Check for duplicate email if email is being changed
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }
  }

  const updateFields: Partial<{ name: string; email: string }> = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

/**
 * Changes the authenticated user's password after verifying the current one.
 */
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput
): Promise<void> => {
  const { currentPassword, newPassword } = input;

  // Must select password field explicitly (it's not returned by default)
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  if (currentPassword === newPassword) {
    throw new AppError('New password must differ from current password', 400);
  }

  // Assign new password — the pre-save hook will hash it
  user.password = newPassword;
  await user.save();
};

/**
 * Permanently deletes the authenticated user's account.
 */
export const deleteAccount = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
};
