# TODO - Skull King Companion

## Fait

- [x] Vérifier la compilation TypeScript (`npx tsc --noEmit`)
- [x] Configurer EAS (`eas.json` avec `buildType: "apk"`)
- [x] Corriger le bundle JS (ajout `babel-preset-expo`)
- [x] Générer le projet Android natif (`npx expo prebuild --platform android`)

## Prochaines étapes

- [ ] Résoudre l'erreur de chemins trop longs Windows (260 chars) pour le build Gradle
  - Option 1 : Déplacer le projet vers un chemin court (ex: `C:\sk-app\`)
  - Option 2 : Activer les chemins longs Windows (registry + redémarrage)
- [ ] Builder l'APK (`cd android && ./gradlew assembleRelease`)
- [ ] Tester l'APK sur un appareil Android
