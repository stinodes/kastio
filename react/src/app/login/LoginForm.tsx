'use client'

import { Button, Link } from '@/src/components/Button'
import { InputError, TextInput } from '@/src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { login } from './actions'

const schema = yup.object({
  username: yup.string().required('Fill in your username to log in.'),
  password: yup.string().required('Fill in your password to log in.'),
})

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(login)}>
      <h1 className="mb-12 text-4xl font-bold">Welcome Back!</h1>
      <TextInput label="Username" {...register('username')} />
      <InputError>{errors.username?.message}</InputError>

      <TextInput label="Password" type="password" {...register('password')} />
      <InputError>{errors.password?.message}</InputError>

      <div className="columns-2 mt-4">
        <Button variant="primary" type="submit">
          Log In
        </Button>
        <Link variant="tertiary" href="/login/new">
          Join us!
        </Link>
      </div>
    </form>
  )
}
