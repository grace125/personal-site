import { Opt } from "./datatypes/Option";

type FormatTagName = "span" | "div" | "ol" | "ul" | "li" | "table" | "tr" | "td";

export type FormatterStringTag = string;
/** For CSSProperties, see https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html#generating-child-elements:~:text=The%20optional-,style,-attribute%20may%20contain */
export type FormatterElemTag = [ FormatTagName, { style?: string  } | undefined, ...FormatterTag[] ];
export type FormatterObjectTag = [ "object", { object: unknown, config?: unknown } ];

export type FormatterTag = FormatterStringTag | FormatterObjectTag | FormatterElemTag;

export const appendFormatter = <T>(props: {
	filter: (val: unknown | T, config: unknown) => val is T;
	header: (val: T, config: unknown) => FormatterElemTag;
	body?: (val: T, config: unknown) => Opt<FormatterElemTag>;
}) => {
	const global = (typeof window === "undefined" ? globalThis : window) as any as { devtoolsFormatters: any[] };
	global.devtoolsFormatters ??= [];
	global.devtoolsFormatters.push({
		header: (val: unknown, config?: unknown) => {
			if (!props.filter(val, config)) return null;
			return props.header(val, config);
		},
		hasBody: props.body ? (val: unknown, config?: unknown) => {
			if (!props.filter(val, config)) return false;
			return props.body!(val, config).isSome();
		} : () => false,
		body: (val: unknown, config?: unknown) => {
			if (!props.filter(val, config)) return null;
			return props.body?.(val, config).orNull() ?? null;
		}
	});
}