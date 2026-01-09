export default defineAppConfig({
  ui: {
    colors: {
      neutral: "zinc",
      primary: "green",
    },
    card: {
      variants: {
        variant: {
          solid: {
            root: "bg-inverted text-inverted",
          },
          outline: {
            root: "bg-default ring ring-default divide-y divide-default",
          },

          subtle: {
            root: "bg-white dark:bg-card-dark border-slate-200 dark:border-border-dark rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
          },
        },
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
    stepper: {
      slots: {
        title: "font-bold text-gray-900 dark:text-white",
        description: "text-[10px] text-slate-400  tracking-wider",
      },
    },
    formField: {
      slots: {
        label: "block text-sm font-semibold text-slate-700 dark:text-slate-300",
      },
    },
    button: {
      slots: {
        // base: "rounded-lg font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-md shadow-primary/20",
      },
      variants: {
        variant: {
          solid:
            "rounded-lg font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-md shadow-primary/20",
        },
        size: {
          md: {
            base: "px-6 py-2 text-sm gap-1.5",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
          },
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "hover:bg-green-600 dark:text-white",
        },
      ],
      defaultVariants: {
        color: "primary",
        variant: "solid",
        size: "md",
      },
    },
  },
})
