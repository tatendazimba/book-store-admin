import { AspectRatio, Box, Card, CardContent, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import placeholderImage from "@/assets/images/placeholder.jpg";
import { RichText } from "../RichText";

type Props = {
    title: string,
    description: string,
    imageUrl?: string,
};

export const ImageCardVertical: React.FC<Props> = props => {
    const { title, description, imageUrl } = props;

    return (
        <Card
            sx={{
                height: '100%',
            }}
        >
            <AspectRatio
                ratio={9/16}
                sx={{
                    p: 0.5,
                }}
            >
                <Image
                    fill
                    src={imageUrl || placeholderImage}
                    loading="lazy"
                    alt={title}
                    style={{
                        objectFit: 'contain',
                    }}
                />
            </AspectRatio>

            <CardContent>
                <Stack>
                    <Typography
                        level="title-lg"
                    >
                        <RichText
                            truncateAfterLine={2}
                        >
                            {title}
                        </RichText>
                    </Typography>

                    <Typography
                        level="body-sm"
                    >
                        <RichText
                            truncateAfterLine={3}
                        >
                            {description}
                        </RichText>
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}