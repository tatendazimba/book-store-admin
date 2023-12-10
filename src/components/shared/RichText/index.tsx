import DOMPurify from 'dompurify';
import { Box } from '@mui/system';
import { FC } from 'react';

type Props = {
    appendAllowedTags?: string[],
    onlyAllowedTags?: string[],
    truncateAt?: number,
    children: string,
    truncateAfterLine?: number,
};

export const RichText: FC<Props> = (props) => {
  const { appendAllowedTags, onlyAllowedTags, truncateAt, children='', truncateAfterLine } = props;

  let allowedTagsList = ['a', 'br', 'p', 'b', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'strong', 'span', 'div'];
  let sx: any = {};

  // add to default allowed tags
  if (appendAllowedTags) {
    allowedTagsList = [...allowedTagsList, ...appendAllowedTags];
  }

  // only allow these tags
  if (onlyAllowedTags) {
    allowedTagsList = onlyAllowedTags;
  }

  // allow no tags if truncateAt or truncateAfterLine is set
  if (truncateAt || truncateAfterLine) {
    allowedTagsList = [];
  }

  const config = {
    ALLOWED_TAGS: allowedTagsList,
  };

  let sanitisedText = DOMPurify.sanitize(children, config);

  // truncate the text if truncateAt is set
  if (truncateAt) {
    // add an ellipsis if the text is truncated
    if (sanitisedText.length > truncateAt) {
      sanitisedText = sanitisedText.substring(0, truncateAt) + '...';
    } else {
      sanitisedText = sanitisedText.substring(0, truncateAt);
    }
  }

  // truncate the text if truncateAfterLine is set
  if (truncateAfterLine) {
    sx = {
      WebkitLineClamp: truncateAfterLine,
      WebkitBoxOrient: 'vertical',
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
  }

  return (
    <Box
      className={'RichText'}
      dangerouslySetInnerHTML={{ __html: sanitisedText }}
      sx={sx}
    />
  )
};