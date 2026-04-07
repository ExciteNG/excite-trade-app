# excite-trade-app — React Native Mobile App Guide

## Stack

| Concern | Technology |
|---------|-----------|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | React Navigation (native stack + bottom tabs) |
| Styling | NativeWind v4 (Tailwind for React Native) |
| State | Redux v4 + Redux Toolkit v1 |
| HTTP | Axios |
| Storage | @react-native-async-storage |
| Icons | Lucide React Native |
| SVG | react-native-svg |
| Build | Expo EAS |

## Project Layout

```
excite-trade-app/
├── App.js                  # Root component — providers, navigation bootstrap
├── Navigation.js           # Stack definitions: AuthStack, SignedInStack, SignedOutStack
├── action.js               # Redux action types + sample/initial data
├── screens/
│   ├── farmers/            # All screens for Farmer users
│   ├── offtakers/          # All screens for Offtaker users
│   └── gemexcite/          # All screens for GemExcite users
├── components/             # Shared reusable components
├── redux/                  # Redux store + slices
└── assets/
    ├── icons/
    ├── images/
    └── adaptive-icon.png / splash.png
```

## Navigation Structure

Three root stacks defined in `Navigation.js`:

```
AuthStack         → Login, Signup, Verification screens
SignedOutStack    → Public/onboarding screens
SignedInStack     → Role-gated screens (Farmer, Offtaker, GemExcite)
```

The root `App.js` reads auth state from Redux and renders the correct stack.

### Adding a New Screen

1. Create the screen component in `screens/[role]/ScreenName.js`
2. Register it in the correct stack in `Navigation.js`:
   ```js
   <Stack.Screen name="ScreenName" component={ScreenName} />
   ```
3. Navigate to it with:
   ```js
   navigation.navigate('ScreenName', { param: value });
   ```

## Styling with NativeWind

Use Tailwind class names via NativeWind. This is the **only** styling method — no `StyleSheet.create`, no inline style objects.

```jsx
import { View, Text } from 'react-native';

export default function Card() {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm">
      <Text className="text-base font-semibold text-gray-800">Title</Text>
    </View>
  );
}
```

NativeWind is configured in `babel.config.js` and `tailwind.config.js`. Custom tokens (brand colors, spacing) are defined there — always use design tokens, not raw hex values.

## State Management

### Redux Store (`redux/`)
- One slice per domain entity (user auth, orders, etc.)
- Action types are defined in `action.js` — add new action type constants there
- Use `useSelector` to read state, `useDispatch` + action creators to update

### Async Storage
Use for persisting auth tokens and user session data:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('et_tkn', token);
const token = await AsyncStorage.getItem('et_tkn');
await AsyncStorage.removeItem('et_tkn');
```

Never store sensitive data (passwords, full user PII) in AsyncStorage — tokens only.

## API Communication

Create Axios calls inside screen files or extract to a dedicated `services/api.js` file if reused across screens. Attach the token from AsyncStorage:

```js
const token = await AsyncStorage.getItem('et_tkn');
const response = await axios.get(`${BASE_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

Base URL:
- **Development:** `http://localhost:4000/api/v1` (use your machine's local IP for device/emulator, not `localhost`)
- **Production:** `https://excite-trade-grb9dyfndagef6ak.westus3-01.azurewebsites.net/api/v1`

## Implemented Screens

### Farmer Screens (`screens/farmers/`)
| File | Screen | Tab |
|------|--------|-----|
| `FarmerTabNavigator.js` | Root bottom tab navigator (5 tabs) | — |
| `FarmerHome.js` | Dashboard: stat cards, quick actions, recent commodities | Home |
| `FarmerCommodity.js` | Commodity list with search + status filters | Produce |
| `FarmerUploadCommodity.js` | Upload form: commodity picker, price, weight, image | Produce |
| `FarmerRequests.js` | Pending order requests with accept/decline | Requests |
| `FarmerRequestHistory.js` | Accepted order history with search | Home (nested) |
| `FarmerWallet.js` | Bank account registration (personal / mutual) | Wallet |
| `FarmerFinancialAid.js` | EMI loan calculator with eligibility accordion | Home (nested) |
| `FarmerSettings.js` | Profile + password tabs | Settings |

### GemExcite Screens (`screens/gemexcite/`)
| File | Screen | Tab |
|------|--------|-----|
| `GemTabNavigator.js` | Root bottom tab navigator (5 tabs) | — |
| `GemHome.js` | Dashboard: stat cards, search, request history | Home |
| `GemManageCluster.js` | Farmer list with search + capacity stats | Cluster |
| `GemFarmerDetail.js` | Farmer profile, capacity bar, assigned orders | Cluster (nested) |
| `GemNewRequest.js` | Pending orders + farmer assignment modal | Requests |
| `GemDepository.js` | Storage: cleared orders + storage entries | Storage |
| `GemQualityControl.js` | Quality measures checklist + price negotiation modal | Home (nested) |
| `GemSettings.js` | Profile + password tabs | Settings |

## Component Conventions

- **Screens:** Full-page components in `screens/[role]/`. Receive `navigation` and `route` props.
- **Shared components:** Go in `components/`. Must be role-agnostic and reusable.
- **Naming:** PascalCase for all component files (`FarmerSignup.js`, `OrderCard.js`).
- Use `.js` (not `.tsx`) to match the existing codebase — TypeScript is not yet set up in the mobile app.

## Common React Native Patterns Used

### SafeAreaView
Wrap screen content in `SafeAreaView` to avoid notch/status bar overlap:
```jsx
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView className="flex-1 bg-white">...</SafeAreaView>
```

### ScrollView vs FlatList
- Use `ScrollView` for static content of known length.
- Use `FlatList` for lists of dynamic/unknown length (orders, commodities, etc.) — it's virtualized.

### Toast Notifications
Use the custom `Toast` component (in `components/`) for user feedback — do not use `Alert.alert` for non-critical messages.

### Loading States
Always show a loading indicator while API calls are in flight. Use `ActivityIndicator` from `react-native`.

## User Role Handling

Current mobile app supports three roles: **Farmer**, **Offtaker**, **GemExcite**.

After login, store `userType` in Redux. Use it to conditionally render role-specific UI or navigate to the correct signed-in stack:

```js
const { userType } = useSelector(state => state.user);
// Navigate to role-appropriate screen
```

## Scripts

```bash
npx expo start           # Start Expo dev server (scan QR with Expo Go)
npx expo start --android # Open on connected Android device / emulator
npx expo start --ios     # Open on iOS simulator
npx expo start --web     # Open in browser (limited RN APIs)
```

## Expo Configuration (`app.json`)

Key settings:
- `newArchitecture: true` — Fabric renderer + JSI is enabled
- `orientation: "portrait"` — locked portrait; do not use landscape layouts
- `userInterfaceStyle: "automatic"` — supports dark mode (ensure dark-mode variants in NativeWind)
- `supportsTablet: true` (iOS) — layouts must be responsive

## Build & Distribution

Uses Expo EAS (Expo Application Services):

```bash
eas build --platform android   # Build Android APK/AAB
eas build --platform ios       # Build iOS IPA
eas submit                     # Submit to app stores
```

## Common Pitfalls

- Do not use `localhost` for API calls on a physical device — use your machine's IP (`192.168.x.x`) or the production URL.
- `AsyncStorage` is asynchronous — always `await` it; forgetting this causes silent failures.
- NativeWind v4 class names are evaluated at build time — dynamic class name strings (template literals) may not work; use conditional objects instead.
- `FlatList` `keyExtractor` is required — always provide a stable unique key from the data.
- React Navigation `navigation` prop is only available in screen components registered in a Stack. Pass it down as a prop or use `useNavigation()` hook in nested components.
- The `newArchitecture` flag is enabled — some older third-party libraries may not be compatible; check for RN 0.80+ support before adding dependencies.
