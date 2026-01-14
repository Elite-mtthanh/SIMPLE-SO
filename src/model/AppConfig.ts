import { ref } from 'vue';

export class AppConfig {
    public static Instance: AppConfig;
    public langIndex = ref<number>(0);

    static init(): void {
        this.Instance = new AppConfig();
    }
}