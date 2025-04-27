import { firebase } from '$d2/lib/base/fire/firebase.svelte';
import { PUBLIC_FIREBASE, PUBLIC_FIREBASE_REGION } from '$env/static/public';

const config = JSON.parse(PUBLIC_FIREBASE);
const region = PUBLIC_FIREBASE_REGION;
firebase.initialize(config, region);
