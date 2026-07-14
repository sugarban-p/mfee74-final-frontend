import { Select } from '@radix-ui/themes';

interface PetSelectFieldProps {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * PetSelectField：
 * 寵物表單共用的 Radix Select 欄位。
 *
 * 使用場景：
 * - 物種
 * - 性別
 * - 是否結紮
 * - 活動量
 *
 * 這些欄位都是「單選」，
 * 所以適合用 Radix Select。
 */
export function PetSelectField({
  label,
  name,
  options,
  defaultValue,
  required = false,
  disabled = false,
}: PetSelectFieldProps) {
  return (
    <label>
      <span className="typo-tab text-text-primary">
        {label}
        {required ? ' *' : ''}
      </span>

      <Select.Root
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
      >
        <Select.Trigger
          placeholder="請選擇"
          className="mt-2 h-11 w-full rounded-full border border-border bg-white px-4 text-sm text-text-primary outline-none disabled:bg-muted disabled:text-text-secondary"
        />

        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </label>
  );
}
