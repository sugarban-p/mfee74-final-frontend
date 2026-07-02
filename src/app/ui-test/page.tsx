'use client';
import { TextField, Box, Button } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross1Icon } from '@radix-ui/react-icons';
export default function UiTestPage() {
  return (
    <>
      <div className="p-5">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Documents</a>
            </li>
            <li>Add Document</li>
          </ul>
        </div>
        <Box maxWidth="300px">
          <TextField.Root
            size="3"
            variant="soft"
            placeholder="在搜尋什麼商品呢?"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            <TextField.Slot side="right">
              <Button onClick={() => {}}>
                <Cross1Icon height="16" width="16" />
              </Button>
            </TextField.Slot>
          </TextField.Root>
        </Box>
      </div>
    </>
  );
}
