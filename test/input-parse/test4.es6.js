
/**
 *  My Test Class.
 */
export class TestClass extends OtherClass {

    static prop = 'this is a static property. ES2015 stage-1 proposal.';

    /**
     *  Some constructor.
     *  @hideconstructor
     */
    constructor() {
        this.value = 1;
    }

    /**
     *  Instance (arrow) method.
     *  @return {Number}
     */
    arrowMethod = () => {
        return true;
    }

    /**
     *  Solves equations of the form a * x = b
     *  @example <caption>Example usage of instanceMethod.</caption>
     *  // returns 2
     *  a.instanceMethod(5);
     *  @returns {Number} Returns the value of x for the equation.
     */
    instanceMethod (a) {
        return this.value / a;
    };
}
