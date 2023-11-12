<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobPostions = ["frontend developer",
                        "backend developer",
                        "full-stack developer",
                        "web developer",
                        "ios developer",
                        "android developer",
                        "project manager",
                        "cloud engineer",
                        "software engineer"
                    ];
        $descriptions = [
            "Are you looking for ".$this->faker->randomElement($jobPostions)." job?",
            "Get tried of looking for ".$this->faker->randomElement($jobPostions)." job?",
            "Are you ".$this->faker->randomElement($jobPostions)." ?",
            "We are looking for ".$this->faker->randomElement($jobPostions)."."
        ];
        // $experience_number = [0, 3, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // $experience_unit = ["month", "year"];
        $experience = ["internship", "entry level", "junior", "senior"];
        // $experience = ["0 month", "1 month", "3 month", "6 month", "8 month", "1 year", "2 year", "3 year", "4 year", "5 year", "6 year"];
        $types = ["hybrid", "remote", "relocate"];
        $locations = ["united-state-of-america", "united-kingdom", "canada", "australia", "norway"];
        $education_level = ["grade4", "grade8", "grade10", "ungraduate", "bachelor", "master", "phd", "none"];
        $requirements = [
            "Must be able to relocate",
            "Must hold work permit in usa",
            "Must be older than 18"
        ];
        $skills = [
            "HTML, CSS, Javascript, ReactJs, TypeScript, Git",
            "HTML, CSS, Javascript, PHP, Laravel, XML",
            "HTML, CSS, Javascript, PHP, Laravel, Wordpress",
            "HTML, CSS, Javascript, Java, Mobile Sdk",
            "HTML, CSS, Javascript, Swift",
            "Linux, AWS",
            "Critical Thinking"
        ];
        $salaries = [
            20000,
            200,
            300,
            30000,
            80000
        ];
        $payment_units = [
            "mmk",
            "usd"
        ];
        $payment_periods = [
            "hour",
            "week",
            "month",
            "year"
        ];

        return [
            "user_id" => 1,
            "position" => $this->faker->randomElement($jobPostions),
            "description" => $this->faker->randomElement($descriptions),
            // "experience_number" => $this->faker->randomElement($experience_number),
            // "experience_unit" => $this->faker->randomElement($experience_unit),
            "experience" => $this->faker->randomElement($experience),
            "type" => $this->faker->randomElement($types),
            "location" => $this->faker->randomElement($locations),
            "education_level" => $this->faker->randomElement($education_level),
            "requirements" => $this->faker->randomElement($requirements),
            "skills" => $this->faker->randomElement($skills),
            "salary" => $this->faker->randomElement($salaries),
            "payment_unit" => $this->faker->randomElement($payment_units),
            "payment_period" => $this->faker->randomElement($payment_periods),
        ];
    }
}
