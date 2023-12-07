import { AspectRatio, Box, Card, CardContent, Typography } from "@mui/joy";
import Image from "next/image";
import placeholderImage from "@/assets/images/placeholder.jpg";

type Props = {
    title: string,
    description: string,
    imageUrl?: string,
};

export const ImageCardVertical: React.FC<Props> = props => {
    const { title, description, imageUrl } = props;

    return (
        <Card>
            <AspectRatio
                ratio={9/16}
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
                <Box>
                    <Typography
                        level="title-lg"
                    >
                        {title}
                    </Typography>

                    <Typography
                        level="body-sm"
                        noWrap
                    >
                        {description}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}