import { useForm, UseFormReturn, FormProvider, FieldValues, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema } from 'yup'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface FormProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => ReactNode
  onSubmit: (data: T) => void | Promise<void>
  validationSchema?: ObjectSchema<T>
  defaultValues?: Partial<T>
  className?: string
  'aria-label'?: string
}

export function Form<T extends FieldValues>({
  children,
  onSubmit,
  validationSchema,
  defaultValues,
  className,
  'aria-label': ariaLabel
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: validationSchema ? (yupResolver(validationSchema) as unknown as Resolver<T>) : undefined,
    defaultValues: defaultValues as any
  })

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data as T)
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit}
        className={classNames('tw-w-full', className)}
        aria-label={ariaLabel || 'Form'}
        noValidate
      >
        {children(methods as UseFormReturn<T>)}
      </form>
    </FormProvider>
  )
}

