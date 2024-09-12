import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  first_name: Yup.string()
    .required()
    .test((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]{2,}$/.test(name)),
  last_name: Yup.string()
    .required()
    .test((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]{2,}$/.test(name)),
  email: Yup.string().required().email(),
  password: Yup.string().required().min(6),
});
