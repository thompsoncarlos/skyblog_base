import { News } from "@/interfaces/news";
import { faker } from "@faker-js/faker";
import { getRandomSubcategories } from "./dataCategories";
import axios from "axios";
import { randomUUID } from "crypto";

export async function generatemNews(length: number) {
    const OPENAI_API_KEY_BASE_URL = "http://localhost:3000/api/openAiRequests";
    const news: News[] = [];
    
    for(let i = 0; i < length; i++) {
        const randowWord = faker.word.verb();
        const category = getRandomSubcategories();

        const titleResponse = await axios.post(OPENAI_API_KEY_BASE_URL, {
            text: `Create a title whit the category "${category.subcategory}" for a blog text. Unique keyword: ${randowWord}, respond
            with text only`, 
        });
        const title = titleResponse.data;

        const [previewResponse, contentResponse] = await Promise.all([
            axios.post(OPENAI_API_KEY_BASE_URL, {
                text: `Create a preview whit the category "${title}" for a blog text. Unique keyword: ${randowWord}, respond
                with text only`, 
            }),
            axios.post(OPENAI_API_KEY_BASE_URL, {
                text: `Create a four-paragraph whit the category "${title}" for a blog text. Unique keyword: ${randowWord}, respond
                with text only`, 
            }),
        ]);

        const preview = previewResponse.data;
        const content = contentResponse.data;
        
        news.push({
            id: i + 1,
            title,
            content,
            description: preview,
            date: new Date().toDateString(),
            datetime: new Date().toISOString(),
            category: {
              title: category.subcategory,
            },
            author: {
              name: faker.person.fullName(),
              role: faker.person.jobTitle(),
              imageUrl: faker.image.avatar(),
            },
            imageUrl:
                category.category === "technology"
                ? "https://i.imgur.com/tIbIBW9.jpg"
                : "https://i.imgur.com/EV9EmEV.jpg",
            });
    }

    return news;
}
