export default defineAppConfig({
  ui: {
    colors: {
      neutral: "zinc",
      primary: "green",
    },
    card: {
      slots: {
        root: "p-2 rounded-lg overflow-hidden",
        header: "pb-3",
        // body: "p-0 sm:p-0",
        // footer: "p-0 sm:p-0",
      },
      variants: {
        variant: {
          solid: {
            root: "bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500",
          },
          outline: {
            root: "bg-default ring ring-default divide-y divide-default",
          },

          subtle: {
            root: "bg-white dark:bg-card-dark border-slate-200 dark:border-border-dark rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500",
          },
        },
      },
      defaultVariants: {
        variant: "solid",
      },
    },
    badge: {
      variants: {
        fieldGroup: {
          horizontal:
            "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
          vertical:
            "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]",
        },
        color: {
          primary: "",
          secondary: "",
          success: "",
          info: "",
          warning: "",
          error: "",
          neutral: "",
        },
        variant: {
          solid: "",
          outline: "",
          soft: "",
          subtle: "",
        },
      },
      compoundVariants: [
        {
          color: "neutral",
          variant: "subtle",
          class:
            "ring-0 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-md text-sm",
        },
      ],
      defaultVariants: {
        color: "neutral",
        variant: "subtle",
        size: "md",
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
