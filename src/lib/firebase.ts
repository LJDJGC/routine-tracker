import { initializeApp, getApps, getApp } from "firebase/app"; // firebaseから初期化する関数、初期化したアプリ取得する関数をインポートする。二重初期化を防ぐシングルトンパターンを実現している。
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // firebaseの認証を扱うためのgetAuth関数とグーグルログイン認証のクラスをインポートする。
import { getFirestore } from "firebase/firestore"; //firestoreにアクセスするための関数をインポートする

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}; // firebaseとの接続に必要である、apikey, authDomain, projectId, storageBucket, messagingSenderId, appIdを環境変数.envから取得している。NEXT_PUBLIC_FIREBASE_なので、この環境変数はブラウザからも参照可能

// Vercelのビルド時（SSGプリレンダリング）や環境変数がない場合に
// Firebase初期化エラーが起きないようにガードする
const isFirebaseAvailable =
  typeof window !== "undefined" &&
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "test-api-key"; //ブラウザで動いていて、firebaseconfigのAPIキーがテストのものでないとき、firebaseが利用可能という条件

let app: ReturnType<typeof initializeApp> | null = null; //firebaseアプリのインスタンスを保持する変数、ReturnType<typeof initializeApp>はTypeScriptの型であり、initializeAppが返す型を推論している。初期化前なのでnullを入れている。
let auth: ReturnType<typeof getAuth> | null = null; //認証インスタンスを保持する変数、初期化前なので、nullを入れている。
let db: ReturnType<typeof getFirestore> | null = null; //firestoreのデータベースを保持する変数、初期化前なので、nullを入れている
let googleProvider: GoogleAuthProvider | null = null; // グーグル認証プロバイダーを保持する変数、初期化前なので、nullを入れている。

if (isFirebaseAvailable) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} //firebaseが利用可能な状態なら、27行目でアプリを取得し、0ならinitializeAppで初期化する。これがシングルトンパターン
//27行目で取得したappからgetAuthで認証情報を取得、27行目で取得したappからgetFirestoreでfirestoreデータベースを取得する。
//googleProviderは、新しいグーグル認証プロバイダーを入れている。

export { app, auth, db, googleProvider, isFirebaseAvailable };//app,auth,db,googleProvider,isFirebaseAvailableをexportできるようにする。