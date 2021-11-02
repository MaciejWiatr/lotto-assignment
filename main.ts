import "./style.scss";
import anime from "animejs";
import confetti from "canvas-confetti";
const drawButtonEl = document.querySelector(".draw__button");
const resetButtonEl = document.querySelector(".reset__button");
const balls: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".lotto-ball");
const inputs: NodeListOf<HTMLInputElement> =
	document.querySelectorAll(".pin-input");
const inputCovers: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".input__cover");
const resultContainer: HTMLDivElement =
	document.querySelector(".result__container");
const resultText: HTMLParagraphElement = document.querySelector(
	".result__container > p"
);
const ballColors = [
	"var(--gradient-red)",
	"var(--gradient-blue)",
	"var(--gradient-pink)",
];
let drawResults: number[] = [];
let userGuesses: number[] = [];
let showingResults = false;

const enterAnimation = anime({
	targets: ".lotto-ball",
	translateX: [500, 0],
	rotate: [720, 0],
	opacity: [0, 1],
	easing: "spring(1, 80, 10, 0)",
	delay: anime.stagger(500),
	autoplay: false,
});

drawButtonEl.addEventListener("click", () => {
	if (showingResults) return;
	drawResults = getRandomNumbers(balls.length);
	userGuesses = Array.from(inputs).map((el) => parseInt(el.value));
	const [correctGuesses, totalGuessesNum] = calculateScore(
		drawResults,
		userGuesses
	);
	balls.forEach((el, idx) => {
		const ballText: any = el.children[0];
		ballText.innerText = drawResults[idx].toString();
	});

	balls.forEach((el) => {
		const ballText: any = el.children[0];
		if (correctGuesses.includes(parseInt(ballText.innerText))) {
			el.style.background = "var(--gradient-green)";
		}
		el.style.background = getRandomBallBg();
	});
	confetti();
	enterAnimation.play();
	toggleResult(correctGuesses.length, totalGuessesNum);
});

resetButtonEl.addEventListener("click", () => {
	toggleInputCovers(inputCovers);
	inputs.forEach((el) => (el.value = null));

	anime({
		targets: ".lotto-ball",
		translateX: -400,
		rotate: -360,
		opacity: 0,
		duration: 500,
		easing: "easeInQuad",
		delay: anime.stagger(200),
		complete: function () {
			toggleInputCovers(inputCovers);
			toggleResult();
		},
	});
});

const toggleInputCovers = (coverElements: NodeListOf<HTMLDivElement>) => {
	coverElements.forEach((el, idx) => {
		setTimeout(() => {
			el.classList.toggle("cover-active");
		}, idx * 100);
	});
};

const toggleResult = (correctGuesses?: number, totalGuesses?: number) => {
	showingResults = !showingResults;
	resultContainer.classList.toggle("result--active");
	if (!showingResults) return;

	resultText.innerText = `Gratulacje, zgadłeś ${correctGuesses} z ${totalGuesses} liczb`;
};

const getRandomBallBg = () => {
	return ballColors[Math.floor(Math.random() * ballColors.length)];
};

// Funkcja kalkulująca ilość poprawnych numerów podanych przez użytkownika,
// zwraca ilość poprawnych oraz całowitą ilość zgadywanych liczb
const calculateScore = (
	drawResults: number[],
	userValues: number[]
): [number[], number] => {
	let correctGuesses = [];
	userValues.forEach((val) => {
		if (drawResults.includes(val)) {
			correctGuesses.push(val);
		}
	});

	return [correctGuesses, userValues.length];
};

const getRandomNumbers = (amount: number) => {
	return Array(amount)
		.fill(1)
		.map(() => Math.floor(Math.random() * 100));
};

function validateInput() {
	if (this.value.length > this.maxLength)
		this.value = this.value.slice(0, this.maxLength);
}

document
	.querySelectorAll("input")
	.forEach((el) => (el.oninput = validateInput));
