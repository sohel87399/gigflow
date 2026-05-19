# Requirements Document

## Introduction

The Settings Page is a fully-featured account management section of the Smart Leads Dashboard. It replaces the current "Coming Soon" placeholder with four functional sections: Profile Settings, Password Change, Appearance, and Danger Zone. The page is accessible to all authenticated users (`admin` and `sales_user` roles) and is rendered inside `DashboardLayout`, consistent with the existing dark UI style (slate/indigo color palette). All form interactions use React Hook Form + Zod for validation, `react-hot-toast` for feedback, and the existing `ApiResponse<T>` response wrapper pattern. New backend endpoints must be added to support profile updates, password changes, and account deletion.

---

## Glossary

- **Settings_Page**: The React page component at `/settings` that hosts all account management sections.
- **Profile_Form**: The React Hook Form form within the Profile Settings section for updating `name` and `email`.
- **Password_Form**: The React Hook Form form within the Password Change section for updating the user's password.
- **Appearance_Section**: The UI section that controls the dark mode preference.
- **Danger_Zone**: The UI section that allows a user to permanently delete their own account.
- **Profile_API**: The backend endpoint `PUT /api/auth/profile` that updates `name` and/or `email`.
- **Password_API**: The backend endpoint `PUT /api/auth/password` that changes the user's password.
- **Delete_Account_API**: The backend endpoint `DELETE /api/auth/account` that permanently deletes the authenticated user's account.
- **Auth_Middleware**: The existing Express middleware that validates the JWT and attaches `req.user` to the request.
- **AuthStore**: The Zustand store (`useAuthStore`) that holds the authenticated user object and token in the frontend.
- **UiStore**: The Zustand store (`useUiStore`) that holds the `darkMode` preference in the frontend.
- **Confirmation_Dialog**: A modal component that requires the user to explicitly confirm a destructive action before it is executed.
- **ApiResponse**: The standard JSON response envelope `{ success, message, data?, error? }` used by all backend endpoints.

---

## Requirements

### Requirement 1: Settings Page Layout and Navigation

**User Story:** As an authenticated user, I want a dedicated Settings page with clearly separated sections, so that I can easily find and manage my account preferences.

#### Acceptance Criteria

1. THE Settings_Page SHALL render inside `DashboardLayout` at the `/settings` route.
2. THE Settings_Page SHALL display four sections: Profile Settings, Password Change, Appearance, and Danger Zone.
3. THE Settings_Page SHALL present the four sections as a vertically stacked, scrollable layout with visible section headings and dividers.
4. WHEN authentication fails or cannot be verified for any reason, THE Settings_Page SHALL redirect the user to `/login`.
5. THE Settings_Page SHALL grant unrestricted access to both `admin` and `sales_user` roles equally, with no role-based feature differences on this page.

---

### Requirement 2: Profile Settings — Update Name and Email

**User Story:** As an authenticated user, I want to update my display name and email address, so that my account information stays current.

#### Acceptance Criteria

1. THE Profile_Form SHALL display pre-populated input fields for `name` and `email`, sourced from the current `AuthStore` user object.
2. WHEN the user submits the Profile_Form, THE Profile_Form SHALL validate that `name` is between 2 and 100 characters.
3. WHEN the user submits the Profile_Form, THE Profile_Form SHALL validate that `email` is a correctly formatted email address.
4. IF the `name` field contains fewer than 2 characters or more than 100 characters, THEN THE Profile_Form SHALL display an inline validation error message beneath the field and display an error toast notification, without submitting the request.
5. IF the `email` field does not match a valid email format, THEN THE Profile_Form SHALL display an inline validation error message beneath the field and display an error toast notification, without submitting the request.
6. WHEN the user submits a valid Profile_Form, THE Profile_API SHALL update the authenticated user's `name` and/or `email` in the database.
7. IF the submitted `email` is already registered to a different account, THEN THE Profile_API SHALL return a `409` status with a descriptive error message.
8. WHEN the Profile_API returns a success response, THE Profile_Form SHALL update the `AuthStore` user object with the new `name` and `email` values.
9. WHEN the Profile_API returns a success response, THE Profile_Form SHALL display a success toast notification with the message "Profile updated successfully".
10. IF the Profile_API returns an error response or the request fails due to a network error, THEN THE Profile_Form SHALL display an error toast notification with the server-provided error message, or "Something went wrong. Please try again." for network-level failures.
11. WHILE the Profile_API request is in-flight, THE Profile_Form SHALL disable the submit button and display a loading indicator.

---

### Requirement 3: Profile API Endpoint

**User Story:** As a developer, I want a secure backend endpoint for updating user profile fields, so that the frontend can persist profile changes.

#### Acceptance Criteria

1. THE Profile_API SHALL accept `PUT` requests at `/api/auth/profile`.
2. THE Profile_API SHALL require a valid JWT, enforced by Auth_Middleware, and return `401` for unauthenticated requests.
3. WHEN a valid request body is received, THE Profile_API SHALL accept an object containing at least one of `name` or `email`.
4. IF the request body contains neither `name` nor `email`, THEN THE Profile_API SHALL return a `400` status with a descriptive error message.
5. WHEN the update is successful, THE Profile_API SHALL return a `200` status with an `ApiResponse` containing the updated user object (`_id`, `name`, `email`, `role`, `createdAt`).

---

### Requirement 4: Password Change

**User Story:** As an authenticated user, I want to change my password by providing my current password, so that I can maintain account security.

#### Acceptance Criteria

1. THE Password_Form SHALL display three fields: `currentPassword`, `newPassword`, and `confirmPassword`.
2. WHEN the user submits the Password_Form, THE Password_Form SHALL validate that `currentPassword` is not empty.
3. WHEN the user submits the Password_Form, THE Password_Form SHALL validate that `newPassword` is at least 8 characters and no more than 128 characters.
4. WHEN the user submits the Password_Form, THE Password_Form SHALL validate that `confirmPassword` matches `newPassword` exactly.
5. IF any Password_Form validation fails, THEN THE Password_Form SHALL display inline error messages beneath the relevant fields and display an error toast notification, without submitting the request.
6. WHEN the user submits a valid Password_Form, THE Password_API SHALL verify that `currentPassword` matches the stored password hash for the authenticated user.
7. IF `currentPassword` does not match the stored hash, THEN THE Password_API SHALL return a `400` status with the message "Current password is incorrect".
8. WHEN the Password_API verifies the current password successfully, THE Password_API SHALL hash `newPassword` and persist it to the database.
9. WHEN the Password_API returns a success response, THE Password_Form SHALL immediately clear all three fields and display a success toast notification with the message "Password changed successfully", regardless of any previously visible inline validation errors.
10. IF the Password_API returns an error response or the request fails due to a network error, THEN THE Password_Form SHALL display an error toast notification with the server-provided error message, or "Something went wrong. Please try again." for network-level failures.
11. WHILE the Password_API request is in-flight, THE Password_Form SHALL disable the submit button and display a loading indicator.

---

### Requirement 5: Password API Endpoint

**User Story:** As a developer, I want a secure backend endpoint for changing a user's password, so that the frontend can persist password changes safely.

#### Acceptance Criteria

1. THE Password_API SHALL accept `PUT` requests at `/api/auth/password`.
2. THE Password_API SHALL require a valid JWT, enforced by Auth_Middleware, and return `401` for unauthenticated requests.
3. WHEN a valid request body is received, THE Password_API SHALL accept `currentPassword` and `newPassword` fields.
4. IF `currentPassword` or `newPassword` is missing from the request body, THEN THE Password_API SHALL return a `400` status with a descriptive error message.
5. IF `newPassword` is fewer than 8 characters or more than 128 characters, THEN THE Password_API SHALL return a `400` status with a descriptive error message.
6. THE Password_API SHALL return a `400` status with a descriptive error message when the password update fails due to incorrect current password verification, and SHALL return a `500` status when the update fails due to a database or server error.
7. WHEN the password is updated successfully, THE Password_API SHALL return a `200` status with an `ApiResponse` containing the message "Password changed successfully".

---

### Requirement 6: Appearance — Dark Mode Toggle

**User Story:** As an authenticated user, I want to toggle dark mode from the Settings page, so that I can control the visual theme of the application.

#### Acceptance Criteria

1. THE Appearance_Section SHALL display a toggle control labelled "Dark Mode" that reflects the current `UiStore` `darkMode` value.
2. WHEN the user activates the dark mode toggle, THE Appearance_Section SHALL call `UiStore.setDarkMode(true)`, apply the `dark` class to `document.documentElement`, and persist the preference to `localStorage` under the key `sl_dark_mode`.
3. WHEN the user deactivates the dark mode toggle, THE Appearance_Section SHALL call `UiStore.setDarkMode(false)`, remove the `dark` class from `document.documentElement`, and persist the preference to `localStorage` under the key `sl_dark_mode`.
4. WHEN the Settings_Page mounts, THE Appearance_Section SHALL display the toggle in the state that matches the persisted `sl_dark_mode` value in `localStorage`.
5. THE Appearance_Section SHALL NOT make any backend API calls; the preference is stored client-side only.

---

### Requirement 7: Danger Zone — Account Deletion

**User Story:** As an authenticated user, I want to permanently delete my account after confirming my intent, so that I can remove my data from the system.

#### Acceptance Criteria

1. THE Danger_Zone SHALL display a "Delete Account" button styled to indicate a destructive action (red/rose color).
2. WHEN the user clicks the "Delete Account" button, THE Danger_Zone SHALL open a Confirmation_Dialog before executing the deletion.
3. THE Confirmation_Dialog SHALL display a warning message explaining that the action is permanent and cannot be undone.
4. WHEN the user confirms the deletion in the Confirmation_Dialog, THE Delete_Account_API SHALL permanently delete the authenticated user's document from the database.
5. WHEN the Delete_Account_API returns a success response AND the user had confirmed the deletion, THE Danger_Zone SHALL call `AuthStore.logout()` to clear the session and redirect the user to `/login`.
6. IF the Delete_Account_API returns an error response, THEN THE Danger_Zone SHALL close the Confirmation_Dialog and display an error toast notification with the server-provided error message.
7. WHEN the user cancels the Confirmation_Dialog, THE Danger_Zone SHALL close the dialog without making any API call.
8. WHILE the Delete_Account_API request is in-flight, THE Confirmation_Dialog SHALL disable the confirm button and display a loading indicator.
9. WHEN the Delete_Account_API request completes, THE Confirmation_Dialog SHALL immediately hide the loading indicator, regardless of whether the response is a success or an error.

---

### Requirement 8: Delete Account API Endpoint

**User Story:** As a developer, I want a secure backend endpoint for deleting a user's own account, so that the frontend can fulfill the account deletion request.

#### Acceptance Criteria

1. THE Delete_Account_API SHALL accept `DELETE` requests at `/api/auth/account`.
2. THE Delete_Account_API SHALL require a valid JWT, enforced by Auth_Middleware, and return `401` for unauthenticated requests.
3. WHEN a valid authenticated request is received, THE Delete_Account_API SHALL delete the user document identified by `req.user._id` from the database.
4. WHEN the deletion is successful, THE Delete_Account_API SHALL return a `200` status with an `ApiResponse` containing the message "Account deleted successfully".
5. IF the user document is not found, THEN THE Delete_Account_API SHALL return a `404` status with a descriptive error message.
6. IF the database deletion operation fails due to a database error or constraint violation, THEN THE Delete_Account_API SHALL return a `500` status and leave the account intact.

---

### Requirement 9: Form Validation and Error Handling

**User Story:** As an authenticated user, I want clear, immediate feedback when I submit invalid data, so that I can correct mistakes without confusion.

#### Acceptance Criteria

1. THE Profile_Form SHALL use React Hook Form with a Zod resolver for all client-side validation.
2. THE Password_Form SHALL use React Hook Form with a Zod resolver for all client-side validation.
3. WHEN a form field fails validation, THE Settings_Page SHALL display the error message directly beneath the relevant input field.
4. IF a backend request fails with a network error, THEN THE Settings_Page SHALL display an error toast notification with the message "Something went wrong. Please try again."
5. THE Settings_Page SHALL NOT display raw HTTP status codes or stack traces to the user.
