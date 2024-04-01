import { Box, ButtonBase } from '@mui/material';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type Props = {
  groups: string[];
  handleScroll: (groupIndex: number) => void;
};

export default function AlphabeticJumpBar({ groups, handleScroll }: Props) {
  return (
    <Box display="flex" flexDirection="column" width={32} ml={1}>
      {alphabet.map((x) => {
        const groupIndex = groups.indexOf(x);
        return (
          <ButtonBase
            disabled={groupIndex === -1}
            key={x}
            onClick={() => handleScroll(groupIndex)}
            sx={(theme) => ({
              flex: 1,
              opacity: groupIndex === -1 ? 0.2 : 1,
              borderTopRightRadius: theme.shape.borderRadius,
              borderBottomRightRadius: theme.shape.borderRadius,
            })}
          >
            {x}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
