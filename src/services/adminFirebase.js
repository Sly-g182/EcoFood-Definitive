import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export const registrarAdminConAuth = async (datos) => {
try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
    nombre: datos.nombre || "",
      tipo: "admin", // admin común
    email: datos.email || ""
    });

    await secondaryAuth.signOut();
    return cred;
} catch (error) {
    console.error("Error registrando administrador:", error);
    throw error;
}
};
