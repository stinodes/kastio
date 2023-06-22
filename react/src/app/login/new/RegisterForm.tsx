'use client'

import { Button, Link } from '@/src/components/Button'
import { InputError, TextInput } from '@/src/components/Input'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { register as registerAction } from '../actions'

const schema = yup.object({
  email: yup
    .string()
    .email('Not a valid email address.')
    .required('Email address is required.'),
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Not the same passwords.')
    .required('Please confirm your password.'),
})

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(registerAction)}>
      <h1 className="mb-12 text-4xl font-bold">Welcome Back!</h1>
      <TextInput
        label="Email address"
        inputMode="email"
        {...register('email')}
      />
      <InputError>{errors.email?.message}</InputError>

      <TextInput label="Username" {...register('username')} />
      <InputError>{errors.username?.message}</InputError>

      <TextInput label="Password" type="password" {...register('password')} />
      <InputError>{errors.password?.message}</InputError>

      <TextInput
        label="Confirm password"
        type="password"
        {...register('confirmPassword')}
      />
      <InputError>{errors.confirmPassword?.message}</InputError>

      <div className="columns-2 mt-4">
        <Button variant="primary" type="submit">
          Register
        </Button>
        <Link variant="tertiary" href="/login">
          Already have an account?
        </Link>
      </div>
    </form>
  )
}

export default RegisterForm
