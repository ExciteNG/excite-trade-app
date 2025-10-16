<!-- @format -->

Profile screen updated to match provided design:

- Replaced placeholder `screens/Profile.js` with a full Profile UI.
- Header with back arrow and title "My Account".
- Avatar circle with initials, name, and company subtitle.
- Menu rows: My Orders, Saved Items, Payment Methods, Settings, Help & Support.
- Each row shows an icon, title, subtitle, and right chevron.
- Red "Log out" row with logout icon.

Notes:

- Uses `lucide-react-native` icons (already in project dependencies).
- Tailwind classes rely on `nativewind` (already configured in the project).
- To populate real user data, replace the `initials`, `name`, and `company`
  variables in `screens/Profile.js` or wire them to your auth/user store.

Gesture handler fix:

- Wrapped the app root (`App.js`) with `GestureHandlerRootView` from
  `react-native-gesture-handler` to avoid the runtime error:
  "NativeViewGestureHandler must be used as a descendant of
  GestureHandlerRootView." This is required so gesture handlers used by some
  components (e.g.,
  `react-native-gesture-handler`/`react-native-gesture-handler`-based controls)
  are recognized.
